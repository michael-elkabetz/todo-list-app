import Header from "../components/Header";
import Footer from "../components/Footer";
import TodoList from "../components/TodoList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main>
        <TodoList />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
