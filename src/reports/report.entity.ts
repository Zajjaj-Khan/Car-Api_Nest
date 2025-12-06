import { Entity,Column,PrimaryColumn } from "typeorm";

@Entity()
export class Report{
    @PrimaryColumn()
    id:string;

    @Column()
    price:number;

}