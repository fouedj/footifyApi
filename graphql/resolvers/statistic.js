const { PlayerModel, TeamModel, MatchModel } = require("../../models")


let dateConversionStage = {
    $addFields: {
      convertedDate: { $toDate: "$createdAt" },
    },
  };
  const pipelineMonthCount = () => {
    let dateProject = [dateConversionStage];
    let groupingSets = [
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },
        },
      },
    ];
    let yearMonthProject = [
      {
        $project: {
          year: { $year: "$convertedDate" },
          month: { $month: "$convertedDate" },
        },
      },
    ];
    let match = [];  
    return [...dateProject, ...match, ...yearMonthProject, ...groupingSets];
  };
module.exports= {
    Query:{
        getCountStatistic:async (root,{},{})=>{
            const countPlayers =await PlayerModel.countDocuments();
            const countTeams = await TeamModel.countDocuments();
            const countMatch =await MatchModel.countDocuments();
            return {countMatch,countPlayers,countTeams}
        },
        getStstisticMatchByYear:(_,{year})=>{
            MatchModel.aggregate(pipelineMonthCount()).then(result=>{
                console.log({result})
            })
        }
    }
}