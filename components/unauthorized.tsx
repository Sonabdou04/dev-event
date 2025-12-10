import FuzzyText from "./FuzzyText";

export default function Unauthorized() {
  return (
    <FuzzyText baseIntensity={0.5} hoverIntensity={0.8} enableHover={true}>
      UNAUTHORIZED
    </FuzzyText>
  );
}
