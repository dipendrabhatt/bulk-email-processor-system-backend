const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class newMigration1689743097656 {

    async up(queryRunner) {
        await queryRunner.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR NOT NULL,
          last_name VARCHAR NOT NULL
        )
      `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
        DROP TABLE users
      `);
    }

}
