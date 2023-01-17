import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'default_avatars' })
export class DefaultAvatar {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	url: string;

	@CreateDateColumn({ type: 'datetime' })
	created_at: Date;

	@UpdateDateColumn({ type: 'datetime' })
	updated_at: Date;
}
