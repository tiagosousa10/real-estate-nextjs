import Navbar from "@/components/Navbar";
import Landing from "./(nondashboard)/landing/page";
// import { redirect } from "next/navigation";

export default function Home() {
  // redirect("/landing");
  return (
    <div className="h-full w-full">
      <Navbar />
      <main className={`h-full flex w-full flex-col`}>
        <Landing />
      </main>
    </div>
  );
}
