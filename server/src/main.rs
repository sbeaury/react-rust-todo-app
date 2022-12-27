#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;
use diesel::{ prelude::*, table, Insertable, Queryable };
use rocket::{ fairing::AdHoc, serde::json::Json, State };
use rocket_sync_db_pools::database;
use serde::{ Deserialize, Serialize };

table! {
    tasks (id) {
        id -> Int4,
        name -> Text,
        completed -> Bool,
    }
}

#[database("my_db")]
pub struct Db(diesel::PgConnection);

#[derive(Serialize, Deserialize, Clone, Queryable, Debug, Insertable)]
#[table_name = "tasks"]
struct Task {
    id: i32,
    name: String,
    completed: bool,
}

#[derive(Deserialize)]
struct Config {
    name: String,
    age: u8,
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/random")]
fn get_random_task() -> Json<Task> {
    Json(Task {
        id: 1,
        name: "My first task".to_string(),
        completed: true,
    })
}

#[get("/<id>")]
fn get_task(id: i32) -> Json<Task> {
    Json(Task {
        id,
        name: "Some task".to_string(),
        completed: true,
    })
}

#[post("/", data = "<task>")]
async fn create_task(connection: Db, task: Json<Task>) -> Json<Task> {
    connection
        .run(move |c| {
            diesel::insert_into(tasks::table).values(&task.into_inner()).get_result(c)
        }).await
        .map(Json)
        .expect("boo")
}

#[delete("/id")]
async fn delete_task(connection: Db, id: i32) -> Json<Task> {
    connection
        .run(move |c| {
            diesel::delete(tasks::table.filter(tasks::id.eq(id))).execute(c);
        }).await
        .map(Json)
        .expect("boo")
}

#[get("/")]
async fn get_all_tasks(connection: Db) -> Json<Vec<Task>> {
    connection
        .run(|c| tasks::table.load(c)).await
        .map(Json)
        .expect("Failed to fetch task")
}

#[get("/config")]
fn custom(config: &State<Config>) -> String {
    format!("Hello, {}! You are {} years old.", config.name, config.age)
}

#[launch]
fn rocket() -> _ {
    let rocket = rocket::build();

    rocket
        .attach(Db::fairing())
        .attach(AdHoc::config::<Config>())
        .mount("/", routes![index, custom])
        .mount(
            "/tasks",
            routes![get_random_task, get_task, get_all_tasks, create_task, delete_task]
        )
}