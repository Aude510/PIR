type ServerMessageType = "answer_path" | "delete_zone" | "block_zone" |"new_drone" | "delete_drone" |"get_status" | "pop_up" ;
export type ServerMessage<T> = {
  type: ServerMessageType
  status: number,
  data :T
}
