import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum IdentifierType {
  Email = 'email',
  Phone = 'phone',
}

@Entity('identities')
export class Identity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string;

  @Column({
    name: 'provider_id',
  })
  providerId: string;

  @Column({
    type: 'enum',
    name: 'identifier_type',
    enum: IdentifierType,
    nullable: false,
  })
  identifierType: IdentifierType;

  @Column()
  identifier: string;

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt: Date;
}