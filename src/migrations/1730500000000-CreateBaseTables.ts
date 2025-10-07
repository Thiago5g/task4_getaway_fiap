import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBaseTables1730500000000 implements MigrationInterface {
  name = 'CreateBaseTables1730500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // usuarios
    await queryRunner.createTable(
      new Table({
        name: 'usuarios',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'nome', type: 'varchar', isNullable: false },
          { name: 'email', type: 'varchar', isUnique: true, isNullable: false },
          { name: 'password', type: 'varchar', isNullable: false },
          { name: 'perfil', type: 'varchar', isNullable: false },
        ],
      }),
      true,
    );

    // clientes
    await queryRunner.createTable(
      new Table({
        name: 'clientes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'nome', type: 'varchar', isNullable: false },
          { name: 'email', type: 'varchar', isUnique: true, isNullable: false },
          { name: 'cpf', type: 'varchar', isNullable: false },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // veiculos
    await queryRunner.createTable(
      new Table({
        name: 'veiculos',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'marca', type: 'varchar', isNullable: false },
          { name: 'modelo', type: 'varchar', isNullable: false },
          { name: 'ano', type: 'int', isNullable: false },
          { name: 'cor', type: 'varchar', isNullable: false },
          { name: 'preco', type: 'numeric', isNullable: false },
          {
            name: 'status',
            type: 'enum',
            enum: ['DISPONIVEL', 'VENDIDO'],
            isNullable: false,
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // vendas
    await queryRunner.createTable(
      new Table({
        name: 'vendas',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'cliente_id', type: 'int', isNullable: false },
          { name: 'veiculo_id', type: 'int', isNullable: false },
          { name: 'data_venda', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('vendas', [
      new TableForeignKey({
        columnNames: ['cliente_id'],
        referencedTableName: 'clientes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['veiculo_id'],
        referencedTableName: 'veiculos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vendas');
    await queryRunner.dropTable('veiculos');
    await queryRunner.dropTable('clientes');
    await queryRunner.dropTable('usuarios');
  }
}
