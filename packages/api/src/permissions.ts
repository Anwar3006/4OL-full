import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  project: ["create", "view", "update", "delete"], // <-- Permissions available for created roles
} as const;

const ac = createAccessControl(statement);

export const registrar = ac.newRole({
  project: ["create"],
});

export const admin = ac.newRole({
  project: ["update"],
});

export const super_admin = ac.newRole({
  project: ["create", "update", "delete"],
});
