import { Button, styled } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { ButtonDefault } from "./styles/ButtonDefault";
import { ButtonPrimary } from "./styles/ButtonPrimary";
import { ButtonDefaultOutline } from "./styles/ButtonDefaultOutline";
import { ButtonSecondary } from "./styles/ButtonSecondary";
import { ButtonSecondaryOutline } from "./styles/ButtonSecondaryOutline";
import { ButtonDanger } from "./styles/ButtonDanger";

const BtnDefault = styled(Button)(() => ButtonDefault);
const BtnDefaultOutline = styled(Button)(() => ButtonDefaultOutline);
const BtnSecondary = styled(Button)(() => ButtonSecondary);
const BtnSecondaryOutline = styled(Button)(() => ButtonSecondaryOutline);
const BtnPrimary = styled(Button)(() => ButtonPrimary);
const BtnDanger = styled(Button)(() => ButtonDanger);

const BtnContent = ({ loading, icon, children }) => {
  if (icon) {
    children = <span className="text">{children}</span>;
  }

  return (
    <>
      {loading == true ? (
        <CircularProgress />
      ) : icon ? (
        <span className="icon">{icon}</span>
      ) : (
        <></>
      )}
      {children}
    </>
  );
};

export const Btn = ({
  type,
  icon,
  outline,
  loading,
  children,
  submit,
  ...props
}) => {
  switch (type) {
    case "primary":
      return (
        <BtnPrimary {...props} type={submit ? "submit" : "button"}>
          <BtnContent loading={loading} icon={icon}>
            {children}
          </BtnContent>
        </BtnPrimary>
      );
    case "secondary":
      if (outline) {
        return (
          <BtnSecondaryOutline {...props} type={submit ? "submit" : "button"}>
            <BtnContent loading={loading} icon={icon}>
              {children}
            </BtnContent>
          </BtnSecondaryOutline>
        );
      }
      return (
        <BtnSecondary {...props} type={submit ? "submit" : "button"}>
          <BtnContent loading={loading} icon={icon}>
            {children}
          </BtnContent>
        </BtnSecondary>
      );
    case "danger":
      return (
        <BtnDanger {...props} type={submit ? "submit" : "button"}>
          <BtnContent loading={loading} icon={icon}>
            {children}
          </BtnContent>
        </BtnDanger>
      );
    default:
      if (outline) {
        return (
          <BtnDefaultOutline {...props} type={submit ? "submit" : "button"}>
            <BtnContent loading={loading} icon={icon}>
              {children}
            </BtnContent>
          </BtnDefaultOutline>
        );
      }
      return (
        <BtnDefault {...props} type={submit ? "submit" : "button"}>
          <BtnContent loading={loading} icon={icon}>
            {children}
          </BtnContent>
        </BtnDefault>
      );
  }
};
