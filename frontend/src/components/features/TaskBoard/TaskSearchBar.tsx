import { Search } from "@mui/icons-material";
import { TextField, IconButton } from "@mui/material";

interface Props{
    setSearchQuery: (e: any) => void
}

const TaskSearchBar: React.FC<Props> = ({ setSearchQuery }) => (
    <form>
        <TextField
            id="search-bar"
            className="text"
            onInput={(e) => {
                setSearchQuery(e.target);
            }}
            variant="outlined"
            placeholder="Find a task.."
            size="small"
        />
        <IconButton type="submit" aria-label="search">
            <Search style={{ fill: "grey" }} />
        </IconButton>
    </form>
);

export default TaskSearchBar