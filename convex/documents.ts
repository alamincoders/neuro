import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
