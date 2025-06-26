import Select from "react-select";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const emojiFlag = (countryCode) =>
  countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt()))
    .join("");

const countryOptions = Object.entries(
  countries.getNames("en", { select: "official" })
).map(([code, name]) => ({
  value: code,
  label: name,
  flag: emojiFlag(code),
}));

const CountrySelect = ({ value, onChange }) => {
  return (
    <Select
      options={countryOptions}
      value={countryOptions.find((opt) => opt.value === value)}
      onChange={(option) => onChange(option?.value)}
      placeholder="Select country"
      isSearchable
      formatOptionLabel={({ label, flag }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 20, marginRight: 10 }}>{flag}</span>
          <span>{label}</span>
        </div>
      )}
      styles={{
        singleValue: (provided) => ({
          ...provided,
          display: "flex",
          alignItems: "center",
        }),
      }}
    />
  );
};

export default CountrySelect;
