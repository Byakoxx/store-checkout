import logo from "../assets/svg/logo.svg";
import placeholder from "../assets/svg/product/placeholder.svg";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img src={logo} alt="logo" className="w-16 h-16 mb-4" loading="lazy" onError={e => { e.currentTarget.src = placeholder; }} />
      <div className="text-lg font-semibold text-primary">Loading...</div>
      <div className="text-muted-foreground text-3xl mt-2">PayFlow Store</div>
    </div>
  );
}