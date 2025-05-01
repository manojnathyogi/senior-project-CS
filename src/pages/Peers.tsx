
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import PeerSupport from "@/components/PeerSupport";

const Peers = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Peer Support</h1>
        <p className="text-muted-foreground">Connect anonymously with others facing similar challenges</p>
        
        <PeerSupport />
      </main>
      
      <Navigation />
    </div>
  );
};

export default Peers;
