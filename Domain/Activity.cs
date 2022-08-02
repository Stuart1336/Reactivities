using System;

namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string City { get; set; }

        public string Venue { get; set; }

        public bool IsCancelled { get; set; }

        //新增Activity時，EntityFrameWork不會幫我們新增Attendee
        //Attendee會是null，此時無法給值 ==> 給予Attendee初始值，讓Attendee為一空陣列
        public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>();

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}