export interface Size {
  width: number,
  length: number,
  height: number
}

export interface Parcel {
  category: string,
  title: string,
  weight: number,
  size: Size
}

export interface APIResponse {
  objects: Array<Parcel>,
  next: string | null
}