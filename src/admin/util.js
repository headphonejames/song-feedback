const color_set = ["#A682FF","#F2D1C9","#715AFF","#8BB174","#D8315B","#8332AC","#5887FF","#55C1FF","#4F7CAC","#B5CA8D","#D5896F"];

export const addColor = (dataset) => {
    let color_index = 0;
    for (let i = 0; i < dataset.data.length; i++) {
        if (color_index > color_set.length - 1) {
            color_index = 0;
        }
        dataset.backgroundColor.push(color_set[color_index]);
        color_index++;
    }
};