namespace Application.Activities
{
    public class AttendeeDto
    {
        //不含Photos，保持Attendee資料簡潔度
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
    }
}