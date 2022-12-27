import Head from "next/head";
import { GiEmptyMetalBucketHandle } from "react-icons/gi";
import { Task } from "../components";
import { type TaskProps } from "../types";

const TASK_URL = `${process.env.API_BASE_URL}/tasks` || "";

export default function Home({ tasks }: { tasks: TaskProps[] }) {
  return (
    <>
      <Head>
        <title>Rust Todo App</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex w-full h-full content-center justify-center bg-blue-50">
          <div className="flex flex-col w-1/3 content-center justify-center gap-2">
            {tasks.length ? (
              tasks.map((task) => <Task key={task.id} {...task} />)
            ) : (
              <div className="w-24 h-24 mx-auto">
                <h2 className="text-center">No task yet</h2>
                <GiEmptyMetalBucketHandle className="mx-auto mt-4 mb-4" size="4rem"/>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(TASK_URL);
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { tasks: data },
  };
}
