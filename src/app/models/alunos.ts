import { Endereco } from "./endereco";
import { Status } from "./status";

export interface Alunos {
    id?: number;
    name: string;
    phoneNumber: string;
    emailAddress: string;
    studentNumber: string;
    status?: Status;
    photo: string; // No JSON do Angular, o array de bytes (byte[]) vira uma String Base64
    addresses: Endereco[]; // List<> do Java vira um array no TypeScript

}
