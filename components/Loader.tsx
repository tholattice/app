import Image from "next/image";

const Loader = () => {
  return (
    <div className="h-screen flex flex-col gap-y-4 items-center justify-center">
      <div className="w-20 h-20 animate-spin items-center justify-center">
        <Image alt="logo" fill src="/TholatticeSymbolWhiteBG.png" />
      </div>
      <p className="text-sm text-gray-400/75">loading...</p>
    </div>
  );
};

export default Loader;
