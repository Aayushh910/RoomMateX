export const PageBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#F4F7FF]">
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-100/40 blur-[120px] mix-blend-multiply"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-100/40 blur-[120px] mix-blend-multiply"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-100/40 blur-[120px] mix-blend-multiply"></div>
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>
    );
};
