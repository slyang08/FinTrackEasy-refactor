import Footer from "../components/Footer";

export default function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-2.5rem)]">
            <div className="w-full bg-blue-1000 flex justify-center pt-3">
                <img src="/homepage.png" />
            </div>
            <Footer />
        </div>
    );
}
