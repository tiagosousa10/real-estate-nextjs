import Navbar from "@/components/Navbar";
// import { redirect } from "next/navigation";

export default function Home() {
  // redirect("/landing");
  return (
    <div className="h-full w-full">
      <Navbar />
    </div>
  );
}
