import HomeSection from '@/components/home/HomeSection';
export default function Home() {
  return (
  <main className=" flex min-h-screen flex-col items-center bg-white ">
      <div className=" flex flex-col items-center justify-start max-w-screen-2xl bg-white  px-2 md:px-7 ">
        <HomeSection />
      </div>

  </main>
  );
}
