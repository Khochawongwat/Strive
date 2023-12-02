import { Component } from "react";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

function matchColor(number: number): string {
    let color;

    if (number > 5) {
        color = "#87CEEB"; // Sky Blue
    } else {
        switch (number) {
            case 1:
                color = "#001F3F"; // Midnight Blue
                break;
            case 2:
                color = "#001F3F"; // Navy Blue
                break;
            case 3:
                color = "#4169E1"; // Royal Blue
                break;
            case 4:
                color = "#1E90FF"; // Dodger Blue
                break;
            default:
                color = "#242D38"; // Default color
                break;
        }
    }

    return color;
}

class GridComponent extends Component {
    renderGrid() {
        const rows = 7;
        const columns = 48;

        const grid = [];

        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < columns; j++) {
                row.push(
                    <Box
                        key={`${i}-${j}`}
                        sx={{ background: matchColor(5), width: ".75rem", height: ".75rem", m: '1.5px', borderRadius: '1px' }}
                    >
                    </Box>
                );
            }
            grid.push(
                <div key={i} style={{ display: "flex" }}>
                    {row}
                </div>
            );
        }
        return grid;
    }

    render() {
        return <div className="grid-container">{this.renderGrid()}</div>;
    }
}

const StreakBoard = () => {
    return <Box sx ={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
        <Typography color={grey[300]} sx={{ my: '8px' }}>
            0 Tasks completed for this year
        </Typography>
        <Box sx={{
            border: "1px solid" + grey[600],
            borderRadius: '8px',
            p: '1rem'
        }}>
            <GridComponent />
        </Box>
    </Box>
};

export default StreakBoard;
