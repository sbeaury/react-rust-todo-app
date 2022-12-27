import Head from "next/head";
import { useRouter } from "next/router";
import { GiEmptyMetalBucketHandle } from "react-icons/gi";
import { Task } from "../components";
import { useApi } from "../hooks/use-api";
import { type TaskProps } from "../types";

const BASE_URL = "http://localhost:8000/tasks";

export default function Home({ tasks }: { tasks: TaskProps[] }) {
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const deleteTask = async function (id: string) {
    const { statusCode } = await useApi({ url: `${BASE_URL}/delete/${id}` });

    if (statusCode === 200) refreshData();
  };
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
              tasks.map((task) => (
                <Task key={task.id} {...task} deleteTask={deleteTask} />
              ))
            ) : (
              <div className="w-24 h-24 mx-auto">
                <h2 className="text-center">No task yet</h2>
                <GiEmptyMetalBucketHandle
                  className="mx-auto mt-4 mb-4"
                  size="4rem"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const { data } = await useApi({ url: `${BASE_URL}` });

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { tasks: data },
  };
}
