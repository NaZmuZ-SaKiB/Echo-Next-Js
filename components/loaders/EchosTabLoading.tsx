import EchoCardLoading from "./EchoCardLoading";

const EchosTabLoading = () => {
  return (
    <div className="w-full mt-10 max-sm:mt-5 space-y-10 max-sm:space-y-4">
      <EchoCardLoading isComment={false} />
      <EchoCardLoading isComment={false} />
    </div>
  );
};

export default EchosTabLoading;
