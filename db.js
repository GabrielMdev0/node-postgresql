async function connect(){

    if(global.connection)
        return global.connection.connect();

    const {Pool} = require("pg");
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });

    const client = await pool.connect();
    console.log("criou o pool de conexão");

    const res = await client.query("select now ()");
    console.log(res.rows[0]);
    client.release();

    global.connection = pool;
    return pool.connect();
}

connect();



async function selectCustomers(){
    const client = await connect();
    const res = await client.query("SELECT * FROM clientes")
    return res.rows;

}

async function selectCustomer(id){
    const client = await connect();
    const res = await client.query("SELECT * FROM clientes WHERE ID=$1", [id]);
    return res.rows;

}

async function insertCustomer(customer){
    const client = await connect();
    const sql = "INSERT INTO clientes (name,email,Phone) VALUES ($1,$2,$3)";
    const res = await client.query(sql, [customer.name, customer.email, customer.phone]);

}

async function updateCustomer(id, customer){
    const client = await connect();
    const sql = "UPDATE clientes SET name=$1, email=$2, phone=$3 WHERE id=$4";
    const res = await client.query(sql, [customer.name, customer.email, customer.phone, id]);

}

async function deleteCustomer(id){
    const client = await connect();
    const sql = "DELETE FROM clientes WHERE id=$1";
    const values = [id];
    await client.query(sql, values);

}


module.exports = {
    selectCustomers,
    selectCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer
}