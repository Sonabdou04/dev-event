import Unauthorized from "../../components/unauthorized";

export default function page() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {" "}
      <Unauthorized />
    </div>
  );
}
