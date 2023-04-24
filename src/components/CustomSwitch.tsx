import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CheckBox } from "@mui/icons-material";

type props = {
  defaultChecked?: boolean,
  onClick?: any,
  checked?: boolean,
  changeRole: any
}





export default function CustomSwitch({ defaultChecked, onClick, checked, changeRole }: props) {
  const [state, setState] = React.useState({
    checkedA: true
  });

  const checkboxControl = <CheckBox />;

  const handleChange = (event: any) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const theme = createTheme({
    components: {
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            // Controls default (unchecked) color for the thumb
            color: "#FF0000"
          },
          colorPrimary: {
            "&.Mui-checked": {
              // Controls checked color for the thumb
              color: "#42E927"
            }
          },
          track: {
            // Controls default (unchecked) color for the track
            opacity: 1,
            backgroundColor: "#FFCDDD",
            ".Mui-checked.Mui-checked + &": {
              // Controls checked color for the track
              opacity: 1,
              backgroundColor: "#B0FFA3"
            }
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <FormGroup>
        <FormControlLabel
          label={''}
          control={
            <Switch
              onClick={onClick}
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={(e) => changeRole(e)}
          

            />
          }

        />
      </FormGroup>
    </ThemeProvider>
  );
}