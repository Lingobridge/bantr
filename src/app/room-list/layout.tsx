export default function RoomLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
       <div className="flex flex-col w-full h-svh items-center">
        
        {children}
        </div>
      </>
    );
  }