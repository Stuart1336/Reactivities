using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                .FirstOrDefault(x => x.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o=> o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o=> o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o=> o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<AppUser, Profiles.Profile>()
                //找出User的Main Photo
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Comment, CommentDto>()
                .ForMember(c => c.Username, o => o.MapFrom(d => d.Author.UserName))
                .ForMember(c => c.DisplayName, o => o.MapFrom(d => d.Author.DisplayName))
                .ForMember(c => c.Image, o => o.MapFrom(d => d.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}