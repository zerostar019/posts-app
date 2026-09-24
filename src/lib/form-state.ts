export type FieldName = "title" | "body" | "userId";

export type CreatePostState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<FieldName, string[]>>;
  values?: Partial<Record<FieldName, string>>;
};

export const initialCreatePostState: CreatePostState = { status: "idle" };
