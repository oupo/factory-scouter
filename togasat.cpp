#include "togasat/togasat.hpp"
#include <emscripten/emscripten.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE int solve(int *buf, int len) {
    togasat::Solver solver;
    std::vector<int> clause;
    for (int i = 0; i < len; i ++) {
        int val = buf[i];
        if (val == 0) {
            solver.addClause(clause);
            clause.clear();
        } else {
            clause.push_back(val);
        }
    }
    return solver.solve();
}

}