import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Item from "./item";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
  // Get the URL parameters using the useRouter hook from Next.js
  const params = useParams();
  // Get the router object using the useRouter hook from Next.js
  const router = useRouter();

  // Create a state variable to keep track of which documents are expanded or
  // collapsed
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Fetch the documents from the Convex API. We pass the parentDocumentId as an
  // argument to the getSidebar function. This function will return all documents
  // that have the given parentDocumentId as their parentDocumentId.
  const documents = useQuery(api.documents.getSidebar, {
    // Pass the parentDocumentId as an argument to the getSidebar function.
    parentDocument: parentDocumentId,
  });

  // Define a function to handle the case when a document is expanded or
  // collapsed. This function will be called when the user clicks on the
  // chevron icon next to a document title.
  const onExpand = (documentId: string) => {
    // Update the expanded state variable to reflect the new state of the
    // document. We use the spread operator to create a new object that
    // contains all the existing key-value pairs in the expanded state
    // variable, and then add a new key-value pair with the documentId as
    // the key and the opposite of the current value as the value.
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  // Define a function to handle the case when the user clicks on a document
  // title. This function will redirect the user to the URL of the document
  // with the given documentId.
  const onRedirect = (documentId: string) => {
    // Use the useRouter hook from Next.js to redirect the user to the URL of
    // the document with the given documentId.
    router.push(`/documents/${documentId}`);
  };

  // If the documents are not yet loaded, display a skeleton component
  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  // If the documents are loaded, display a list of documents. Each document
  // will be rendered as an Item component with the title, icon, and other
  // properties of the document. The Item component will also be passed the
  // onExpand and onRedirect functions as props.
  return (
    <>
      <p
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      >
        No pages found!
      </p>

      {documents.map((document) => (
        <div
          key={document._id}
          className=""
        >
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList
              // Pass the parentDocumentId as a prop to the DocumentList
              // component.
              parentDocumentId={document._id}
              // Pass the level as a prop to the DocumentList component. We
              // increment the level by 1 because the DocumentList component
              // will be rendered as a child of the current document.
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
