import AddIcon from '@mui/icons-material/Add';
import Drawer from '@mui/material/Drawer';
import { useState } from 'react';

const CreateCampaignTile = (props) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [targetFunds, setTargetFunds] = useState(0);
    const [duration, setDuration] = useState(0);

    const tileStyle = props.skipVoteIcons ? {height: "270px"} : {};

    const descriptionA = "EcoRevive is a comprehensive campaign aimed at revitalizing local ecosystems through community engagement and sustainable practices. The project focuses on restoring biodiversity, combating climate change, and promoting environmental stewardship. Through tree planting initiatives, habitat restoration projects, and educational workshops, EcoRevive empowers individuals to take an active role in preserving and enhancing their natural surroundings. By fostering a sense of environmental responsibility and collective action, the campaign seeks to create lasting positive impacts on both the local environment and the community as a whole.";

    const onAddCampaign = (e) => {
        e.stopPropagation();
        setDrawerOpen(true);
    };

    const setData = (e, component) => {
        if(component === "name") {
            setName(e.target.value);
        } else if(component === "description") {
            setDescription(e.target.value);
        } else if(component === "targetFunds") {
            setTargetFunds(parseInt(e.target.value) * 1000000000); //ETH to GWEI
        } else if(component === "duration") {
            setDuration(parseInt(e.target.value));
        }
    };

    const onClickCreateCampaign = (e) => {
        e.stopPropagation();
        if(!name || !description || targetFunds <= 0 || duration <= 0) {
            alert("Campaign values not set");
            return;
        }

        props.createCampaign(name, description, targetFunds, duration);
    };

    const getDrawerForm = () => {
        return (
            <div className="sidebar">
                <label>Campaign name</label>
                <input type="text" onChange={(e) => {setData(e, "name")}} />
                <label>Campaign description</label>
                <textarea type="text" placeholder="Write campaign description here" onChange={(e) => {setData(e, "description")}} />
                <label>Target funds</label>
                <input type="text" onChange={(e) => {setData(e, "targetFunds")}} />
                <label>Duration (in minutes)</label>
                <input type="text" onChange={(e) => {setData(e, "duration")}} />
                <input type="submit" value="Create campaign" onClick={onClickCreateCampaign}/>
            </div>
        )
    };

    return (
        <>
            <div className="campaign-tile" style={tileStyle} onClick={onAddCampaign}>
                <div className="add-icon"><AddIcon/></div>
            </div>
            <Drawer open={isDrawerOpen} onClose={() => {setDrawerOpen(false)}}>
                {getDrawerForm()}
            </Drawer>
        </>
        
    );
};

export default CreateCampaignTile;