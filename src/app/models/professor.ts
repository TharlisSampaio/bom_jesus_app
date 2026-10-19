import { Endereco } from "./endereco";
import { Status } from "./status";

export interface Professor {
    id: number; // Long do Java vira number
    name: string;
    phoneNumber: string;
    emailAddress: string;
    status: Status; // Utiliza o Enum compartilhado de Status
    salary: number; // BigDecimal do Java vira number no TypeScript
    address: Endereco[]; // List<> do Java vira um array []

}