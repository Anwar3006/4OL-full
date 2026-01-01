import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createPaginationHandlers = (
  currentPage: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  totalPages: number = 1
) => ({
  next: () => {
    if (currentPage < totalPages) setPage((prev) => prev + 1);
  },
  previous: () => {
    if (currentPage > 1) setPage((prev) => prev - 1);
  },
  goTo: (page: number) => {
    if (page >= 1 && page <= totalPages) setPage(page);
  },
});

export const getDeepestNodes = (selectedIds: string[], allData: any[]) => {
  // 1. Create a set for O(1) lookups
  const selectedSet = new Set(selectedIds);

  // 2. Filter the selected IDs
  return selectedIds.filter((id) => {
    // Check if any OTHER selected ID has this ID as its parent
    const hasSelectedChild = allData.some(
      (item) => item.parentId === id && selectedSet.has(item.id)
    );

    // If it has a selected child, it's a parent/ancestor; discard it.
    // If it has NO selected children, it is the 'deepest' node in this branch.
    return !hasSelectedChild;
  });
};

/**
 * Takes leaf IDs from the DB and returns an array including all ancestors
 * so the Tree UI shows the full path as selected.
 */
export const rehydrateHierarchy = (leafIds: string[], allData: any[]) => {
  const expandedIds = new Set<string>();

  const addAncestors = (id: string) => {
    const item = allData.find((d) => d.id === id);
    if (!item) return;

    expandedIds.add(item.id);

    if (item.parentId) {
      addAncestors(item.parentId);
    }
  };

  leafIds.forEach(addAncestors);
  return Array.from(expandedIds);
};

export const hasLexicalContent = (json: any): boolean => {
  if (!json?.root?.children) return false;

  // Check if there's more than one paragraph, or if the first paragraph isn't empty
  return json.root.children.some((child: any) => {
    // If the node itself has text (uncommon for root children, but safe)
    if (child.text?.trim()) return true;

    // Check nested children (the standard Lexical structure)
    if (child.children?.length > 0) {
      return child.children.some(
        (textNode: any) =>
          textNode.text?.trim() !== "" || textNode.type !== "text"
      );
    }

    // If it's a non-text node (like an Image or Horizontal Rule), it counts as content
    return child.type !== "paragraph" && child.type !== "text";
  });
};

// ======================== Permissions ========================
import { ROLE_PERMISSIONS } from "@/constants/users.const";
import { TUserProfile } from "@4ol/db/schemas/user-profile.schema";

export function hasPermission(userPermissions: string[], action: string) {
  if (userPermissions.includes("*")) {
    return !userPermissions.includes(`!${action}`);
  }
  return userPermissions.includes(action);
}

export const getPermissionsForRole = (role: TUserProfile["role"]) => {
  // Return the specific object containing allowedRoutes and actions
  return ROLE_PERMISSIONS[role] || { allowedRoutes: [], actions: [] };
};

export const canAccessRoute = (role: TUserProfile["role"], route: string) => {
  const { allowedRoutes }: { allowedRoutes: string[] } =
    getPermissionsForRole(role);

  if (allowedRoutes.includes("*")) {
    return !allowedRoutes.includes(`!${route}`);
  }
  return allowedRoutes.includes(route);
};
