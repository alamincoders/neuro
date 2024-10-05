import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Get the list of documents that belong to the user who made this request
export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    // Get the identity of the user who made this request
    const identity = await ctx.auth.getUserIdentity();

    // If the user isn't authenticated, throw an error
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the ID of the user who made this request
    const userId = identity.subject;

    // Query the database for all documents that belong to the user who made
    // this request and have the specified parent document
    //
    // We use the "by_user_parent" index here, which is a composite index of
    // the "userId" and "parentDocument" fields. This means that the database
    // will only have to scan documents that belong to this user and have this
    // parent document, which is much faster than scanning the whole database.
    //
    // We also filter out archived documents, since we don't want to show those
    // in the sidebar.
    //
    // Finally, we sort the results in descending order by ID, which means that
    // the most recently created documents will be at the top of the list.
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    // Return the list of documents to the client
    return documents;
  },
});

// Create a new document
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      userId,
      parentDocument: args.parentDocument,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

// Archive a document
export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    // Get the identity of the user who made this request
    const identity = await ctx.auth.getUserIdentity();

    // If the user isn't authenticated, throw an error
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the ID of the user who made this request
    const userId = identity.subject;

    // Get the document that the user is trying to archive
    const existingDocument = await ctx.db.get(args.id);

    // If the document doesn't exist, throw an error
    if (!existingDocument) {
      throw new Error("Document not found");
    }

    // If the user who made the request isn't the owner of the document, throw an error
    if (existingDocument.userId !== userId) {
      throw new Error("You do not have permission to archive this document");
    }

    // Define a recursive function that will be used to archive all documents
    // that have the document we're currently archiving as their parent
    const recursiveDocuments = async (documentId: Id<"documents">) => {
      try {
        // Get all of the documents that have the current document as their parent
        const children = await ctx.db
          .query("documents")
          .withIndex("by_user_parent", (q) =>
            q.eq("userId", userId).eq("parentDocument", documentId)
          )
          .collect();

        // For each of the children, patch them to set isArchived to true
        for (const child of children) {
          if (child === null || child === undefined) {
            throw new Error("Child document was null or undefined");
          }

          await ctx.db.patch(child._id, {
            isArchived: true,
          });

          // Recursively call the recursiveDocuments function on each of the children
          await recursiveDocuments(child._id);
        }
      } catch (error) {
        console.error("Error in recursiveDocuments:", error);
        throw error;
      }
    };

    // Call the recursiveDocuments function on the document we're currently archiving
    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    await recursiveDocuments(args.id);

    // Return the document that we just archived
    return document;
  },
});

// Get the list of documents that belong to the user who made this request
export const getTrash = query({
  handler: async (ctx) => {
    // Get the identity of the user who made this request
    const identity = await ctx.auth.getUserIdentity();

    // If the user isn't authenticated, throw an error
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the ID of the user who made this request
    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return documents;
  },
});

// Restore a document
export const restore = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Document not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("You do not have permission to restore this document");
    }

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        if (child === null || child === undefined) {
          throw new Error("Child document was null or undefined");
        }

        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);

      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }
    const document = await ctx.db.patch(args.id, options);

    await recursiveRestore(args.id);

    return document;
  },
});

// Remove a document
export const remove = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Document not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("You do not have permission to delete this document");
    }

    const document = await ctx.db.delete(args.id);
    return document;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents;
  },
});
