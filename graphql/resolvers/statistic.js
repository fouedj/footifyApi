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
          const month= [1,2,3,4,5,6,7,8,9,10,11,12];
            return MatchModel.aggregate(pipelineMonthCount()).then(results=>{
                let tabs =[];
                month.forEach((m,index)=>{
                  let find=results.find(r=>r._id ==m)
                  if(find){
                    tabs.push({_id:find._id,count:find.count})
                  }else{
                    tabs.push({_id:m,count:0});
                  }
                })
                return tabs;
            })
        }
    }
}