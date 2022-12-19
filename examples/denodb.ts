import { Database, SQLite3Connector, Model, DataTypes, Relationships  } from 'https://deno.land/x/denodb/mod.ts';

const connector = new SQLite3Connector({
  filepath: './database.sqlite',
});

const db = new Database(connector);



class Business extends Model {
    static table = 'businesses'
    static timestamps = true;

    static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        // name: {
        //     type: DataTypes.STRING,
        //     length: 25,
        // },
        name: DataTypes.string(25), // this does the same as the line above
        score: DataTypes.INTEGER
    };

    static defaults = {
        score: 2,
    };
}



class Employee extends Model {
    static table = 'employee'
    static timestamps = true; 
    static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        // name: {
        //     type: DataTypes.STRING,
        //     length: 25,
        // },
        name: DataTypes.string(25), // this does the same as the line above
    }
    
}

const Employees = Relationships.manyToMany(Business, Employee);




db.link([Business, Employee, Employees]);
