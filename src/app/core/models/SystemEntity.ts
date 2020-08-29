export class SystemEntity {
  id: string;
  name: string;
  path: string[];
  createdAt: Date;
  type: string;
  children?: SystemEntity[];
  uid?: string;

  constructor(
    id: string,
    name: string,
    path: string[],
    createdAt: Date,
    type: string,
    
    children?: SystemEntity[],
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