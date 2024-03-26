import { Button, styled } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { ButtonDefault } from "./styles/ButtonDefault";
import { ButtonPrimary } from "./styles/ButtonPrimary";
import { ButtonDefaultOutline } from "./styles/ButtonDefaultOutline";
import { ButtonSecondary } from "./styles/ButtonSecondary";
import { ButtonSecondaryOutline } from "./styles/ButtonSecondaryOutline";

const BtnDefault = styled(Button)(() => ButtonDefault);
const BtnDefaultOutline = styled(Button)(() => ButtonDefaultOutline);
const BtnSecondary = styled(Button)(() => ButtonSecondary);
const BtnSecondaryOutline = styled(Button)(() => ButtonSecondaryOutline);
const BtnPrimary = styled(Button)(() => ButtonPrimary);

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

export const Btn = ({ type, icon, outline, loading, children, ...props }) => {
  switch (type) {
    case "primary":
      return (
        <BtnPrimary {...props}>
          <BtnContent loading={loading} icon={icon}>
            {children}
          </BtnContent>
        </BtnPrimary>
      );
    case "secondary":
      if (outline) {
        return (
          <BtnSecondaryOutline {...props}>
            <BtnContent loading={loading} icon={icon}>
              {children}
            </BtnContent>
          </BtnSecondaryOutline>
        );
      }
      return (
        <BtnSecondary {...props}>
          <BtnContent loading={loading} icon={icon}>
            {children}
          </BtnContent>
        </BtnSecondary>
      );
    default:
      if (outline) {
        return (
          <BtnDefaultOutline {...props}>
            <BtnContent loading={loading} icon={icon}>
              {children}
            </BtnContent>
          </BtnDefaultOutline>
        );
      }
      return (
        <BtnDefault {...props}>
          <BtnContent loading={loading} icon={icon}>
            {children}
          </BtnContent>
        </BtnDefault>
      );
  }
};
