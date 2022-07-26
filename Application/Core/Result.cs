using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }

        public T Value { get; set; }

        public string Error { get; set; }

        //Success可檢查回傳的Result<T>是否為一空Entity
        public static Result<T> Success(T value) => new Result<T> {IsSuccess = true, Value = value};

        public static Result<T> Failure(string error) => new Result<T> {IsSuccess = false, Error = error};
    }
}