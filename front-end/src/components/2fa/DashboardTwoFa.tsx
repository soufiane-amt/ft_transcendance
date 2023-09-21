import "../../styles/DashboardTwoFa.css";

function DashboardTwoFa() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute bg-black opacity-50"></div>
      <div className="bg-white rounded shadow-lg w-[800px] h-[700px] flex justify-around items-center">
        <button className="hover:cursor-pointer">hello</button>
      </div>
    </div>
  );
}

export default DashboardTwoFa;
