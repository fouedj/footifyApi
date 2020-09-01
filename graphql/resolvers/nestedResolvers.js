const { InvitationModel } = require("../../models");

module.exports ={
    Team:{
		location:(team,{},{user})=>{
			const {location}=team;
		
			return {
				lat:location.coordinates[0],
				lng:location.coordinates[1]
			}
		},
        //nestedItem:()=> "I am nested ",
        playerCount:(team,{},{user})=> team.members.length,
       // name:()=>" n'exist pas"
	},
	Player:{
		invitations:(player,{},{user})=>{
		 return InvitationModel.find({player:player.id})

		}
	},
	Match:{
		location:(match,{},{user})=> {
			const {location}=match
			return{
				lat:location.coordinates[0],
				lng:location.coordinates[1]
			}
		}
	}
}