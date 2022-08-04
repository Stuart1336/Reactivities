using System.Text.Json.Serialization;

namespace Application.Profiles
{
    public class UserActivityDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }

        [JsonIgnore] //此屬性不會送到Client side
        public string HostUsername { get; set; }
    }
}