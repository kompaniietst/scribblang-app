export class FileSystemEntity {
  id: string;
  name: string;
  path: string[];
  createdAt: Date;
  type: string;
  children?: FileSystemEntity[];
  uid?: string;

  constructor(
    id: string,
    name: string,
    path: string[],
    createdAt: Date,
    type: string,
    
    children?: FileSystemEntity[],
    uid?:string) {

    this.id = id;
    this.name = name;
    this.path = path;
    this.type = type;
    this.createdAt = createdAt;
    this.children = children;
    this.uid = uid;
  }
}