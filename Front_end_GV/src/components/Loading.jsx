import Header from "./Header";
import Menu from "./Menu";

export default function Loading() {
    return (
        <div>
            <Header />
            <div className="main-content">
                <Menu />
                <div className="right-part">
                    <div className="mx-auto h-full flex justify-center items-center">
                        <h1 className="text-6xl">Đang tải...</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}