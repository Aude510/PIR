type ServerRequestType = "answer_path" | "delete_zone" | "block_zone" |"new_drone" | "delete_drone" |"get_status" ;
export type ServerRequest<T> = {
  type: ServerRequestType,
  data: T
}
